import ClearIcon from '@mui/icons-material/Clear';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import * as Diff from 'diff';
import React, { useCallback, useEffect } from 'react';

import Heading from '../components/Heading';
import Layout from '../components/Layout';
import useLocalState from '../hooks/useLocalState';
import useSupportsClipboardRead from '../hooks/useSupportsClipboardRead';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const MODE = ['text', 'words', 'wordsWithSpace', 'lines', 'trimmedLines', 'sentences', 'css', 'json', 'array'] as const
type MODE_TYPE = typeof MODE[number]

export default function TextDiffPage() {
  const supportsClipboardRead = useSupportsClipboardRead();
  const [input1, setInput1] = useLocalState<string>({
    key: 'textDiff_input1',
    defaultValue: '',
  });
  const [input2, setInput2] = useLocalState<string>({
    key: 'textDiff_input2',
    defaultValue: '',
  });
  const [output, setOutput] = useLocalState<string | void>({
    key: 'textDiff_output',
    defaultValue: '',
  });
  const [mode, setMode] = useLocalState<MODE_TYPE>({
    key: 'mode',
    defaultValue: 'text',
  });

  function handleChange1(event: React.ChangeEvent<HTMLInputElement>) {
    setInput1(event.target.value);
  }
  function handleChange2(event: React.ChangeEvent<HTMLInputElement>) {
    setInput2(event.target.value);
  }

  function getDiff(ip1: string, ip2: string) {
    switch(mode) {
      case 'words':
        return Diff.diffWords(ip1, ip2);
      case 'wordsWithSpace':
        return Diff.diffWordsWithSpace(ip1, ip2);
      case 'lines':
        return Diff.diffLines(ip1, ip2);
      case 'trimmedLines':
        return Diff.diffTrimmedLines(ip1, ip2);
      case 'sentences':
        return Diff.diffSentences(ip1, ip2);
      case 'css':
        return Diff.diffCss(ip1, ip2);
      case 'json':
        return Diff.diffJson(ip1, ip2);
      default:
        return Diff.diffChars(ip1, ip2);
    }
  }

  const diff = getDiff(input1, input2);

  const compare = useCallback(() => {
    let value = '';
    diff.forEach((part) => {
      // green for additions, red for deletions
      // grey for common parts

      let clr = 'grey';
      if (part.added) {
        clr = 'green';
      } else if (part.removed) {
        clr = 'red';
      } else {
        clr = 'grey';
      }

      value += `<span style="color:${clr}">${part.value}</span>`;
    });
    setOutput(value);
  }, [diff, setOutput]);

  useEffect(() => {
    if (!input1 || !input2) {
      setOutput('');
    } else {
      compare();
    }
  }, [input1, input2, compare, setOutput]);

  return (
    <Layout title='Text Difference'>
      <Heading>Text Diff</Heading>
      <Typography
        paragraph
        textAlign='center'
      >
        Type or paste text into both fields to check the difference.
      </Typography>

      <Box
        display='flex'
        paddingBottom={2}
        width={1000}
        maxWidth='100%'
      >
        <FormControl>
          <InputLabel id='mode-select-label'>
                  Mode
          </InputLabel>
          <Select
            labelId='mode-select-label'
            label='Mode'
            id='mode-select'
            value={mode}
            onChange={(e) => setMode(e.target.value as MODE_TYPE)}
          >
            <MenuItem value={'text'}>Text</MenuItem>
            <MenuItem value={'words'}>Words</MenuItem>
            <MenuItem value={'wordsWithSpace'}>WordsWithSpace</MenuItem>
            <MenuItem value={'lines'}>Lines</MenuItem>
            <MenuItem value={'trimmedLines'}>TrimmedLines</MenuItem>
            <MenuItem value={'sentences'}>Sentences</MenuItem>
            <MenuItem value={'css'}>CSS</MenuItem>
            <MenuItem value={'json'}>JSON</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        paddingBottom={2}
        width={1000}
        maxWidth='100%'
      >
        <Box
          display='flex'
          flexDirection='column'
          width={{ xs: '100%', sm: '45%' }}
        >
          <TextField
            multiline
            label='Text 1'
            value={input1}
            name='first text'
            onChange={handleChange1}
          />
          <Box
            display='flex'
            flexWrap='wrap'
            justifyContent='flex-end'
            gap={2}
          >
            {!!supportsClipboardRead && (
              <Button
                startIcon={<ContentPasteGoIcon />}
                onClick={async () => {
                  const text = await navigator.clipboard.readText();
                  if (text) {
                    setInput1(text);
                  }
                }}
              >
                Paste
              </Button>
            )}
            <Button
              startIcon={<ClearIcon />}
              disabled={!input1}
              onClick={() => {
                setInput1('');
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          width={{ xs: '100%', sm: '45%' }}
        >
          <TextField
            multiline
            label='Text 2'
            value={input2}
            name='second text'
            onChange={handleChange2}
          />
          <Box
            display='flex'
            flexWrap='wrap'
            justifyContent='flex-end'
            gap={2}
          >
            {!!supportsClipboardRead && (
              <Button
                startIcon={<ContentPasteGoIcon />}
                onClick={async () => {
                  const text = await navigator.clipboard.readText();
                  if (text) {
                    setInput2(text);
                  }
                }}
              >
                Paste
              </Button>
            )}
            <Button
              startIcon={<ClearIcon />}
              disabled={!input2}
              onClick={() => {
                setInput2('');
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='stretch'
        width={1000}
        maxWidth='100%'
        gap={2}
      >
        <Box
          padding='16.5px 14px'
          borderRadius='4px'
          border='1px solid #494949'
          sx={{
            '& .bad-line': {
              backgroundColor: '#ff330050',
            },
            '& .bad-letter': {
              backgroundColor: '#ff000080',
            },
            '& pre': {
              fontsize: '1rem',
              lineHeight: '1.4375em',
              letterSpacing: '0.00938em',
            },
            '& .placeholder': {
              opacity: 0.7,
            },
          }}
        >
          {/* eslint-disable react/no-danger */}
          <pre
            data-testid='text-difference-output'
            dangerouslySetInnerHTML={{
              __html:
                output || '<span class="placeholder">Difference</span>',
            }}
          />
          {/* eslint-enable react/no-danger */}
        </Box>
      </Box>
    </Layout>
  );
}
