import React, { useState } from 'react';

export namespace Slider {
  export function useSlider(slides: readonly string[]): useSliderReturnType {
    const [index, setSlideIndex] = useState(0);
    const [name, setSlideName] = useState(slides[index]);

    if (slides.length <= 0) {
      throw new Error(
        'The `slides` array must contain a list of slide names. None given.'
      );
    }

    const updateSlideByName = (name: string): void => {
      const index = slides.indexOf(name);
      if (!~index) return;
      setSlideName(name);
      setSlideIndex(index);
    };

    const updateSlideById = (index: number): void => {
      if (!(index >= 0 && slides.length > index)) return;
      setSlideName(slides[index]);
      setSlideIndex(index);
    };

    const goTo = (slide: number | string) => {
      switch (typeof slide) {
        case 'string':
          return updateSlideByName(slide);
        case 'number':
          return updateSlideById(slide);
      }
    };

    const prev = () => {
      if (index > 0) {
        updateSlideById(index - 1);
      }
    };

    const next = () => {
      if (index < slides.length - 1) {
        updateSlideById(index + 1);
      }
    };

    const reset = () => {
      updateSlideById(0);
    };

    return {
      name,
      index,
      prev,
      next,
      reset,
      goTo,
    };
  }

  export function Carousel({
    index,
    slides,
    children,
  }: React.PropsWithChildren<SliderProps>) {
    return (
      <div className="slider">
        {children &&
          React.Children.map(children, (child, i) => (
            <>{i in slides && i === index && child}</>
          ))}
      </div>
    );
  }

  export function Slide({ children }: React.PropsWithChildren) {
    return <div className="slide">{children}</div>;
  }

  export type useSliderReturnType = {
    name: string;
    index: number;
    prev: () => void;
    next: () => void;
    reset: () => void;
    goTo: (slide: string | number) => void;
  };

  export type SliderProps = {
    index: number;
    slides: readonly string[];
  };
}

export default Slider;
