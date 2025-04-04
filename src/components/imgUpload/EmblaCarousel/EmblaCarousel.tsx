import React from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import ClassNames from 'embla-carousel-class-names'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import type { ImgType } from '~/components/UploadUI/UploadUI'
import Image from 'next/image'
type PropType = {
  slides: ImgType[]
  options?: EmblaOptionsType
  currentIndex: number; // New prop to track current index
  setCurrentIndex: (index: number) => void; // New prop to update current index
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, currentIndex, setCurrentIndex } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  React.useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi, setCurrentIndex]);
  
  if (slides.length === 0) return null;

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((img) => (
            <div className="embla__slide embla__class-names" key={img.id}>
              <Image
                className="embla__slide__img"
                src={img.src}
                alt="Product image"
                width={800}
                height={600}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  objectPosition: 'center',
                  backgroundColor: '#f5f5f5'
                }}
                priority={true}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
