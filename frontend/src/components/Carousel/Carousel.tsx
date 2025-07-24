
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import '@mantine/carousel/styles.css';
import classes from './Carousel.module.css'


const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
];

export function Carousels() {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <img src={url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      classNames={classes}
      withIndicators
      height={220}
      plugins={[autoplay.current]}
      emblaOptions={{ loop: true, dragFree: true, align: 'start' }}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
    >
      {slides}
    </Carousel>
  );
}