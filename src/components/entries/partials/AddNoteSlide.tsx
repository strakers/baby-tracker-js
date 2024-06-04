import { createRef } from 'react';
import { Slider } from '../../../components/layout/Slides';

interface AddNoteProps {
  setNote: React.Dispatch<React.SetStateAction<string>>;
  slider?: Slider.useSliderReturnType;
}

export function AddNote({ setNote, slider }: AddNoteProps) {
  const noteRef = createRef<HTMLTextAreaElement>();
  return (
    <>
      <p>Add Note?</p>
      <p>
        <textarea ref={noteRef} />
      </p>
      <button
        onClick={() => {
          if (noteRef.current) {
            const value = noteRef.current.value;
            setNote(() => value);
            if (slider) slider.next();
          }
        }}
      >
        Save
      </button>
      {slider && <button onClick={() => slider.next()}>Skip</button>}
    </>
  );
}
