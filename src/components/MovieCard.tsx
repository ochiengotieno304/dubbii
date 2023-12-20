import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  CardFooter,
  Button,
  Image
} from '@chakra-ui/react';

interface MovieCardProps {
  movieTitle: string;
  movieOverview: string;
  moviePosterPath: string;
  movieId: string;
  onClick: () => void;
}

const MovieCard = ({ movieTitle, movieOverview, moviePosterPath, onClick, movieId }: MovieCardProps) => {
  const movieSlug = movieTitle.replace(/\s+/g, '-').toLowerCase();

  return (
    <Card maxW='sm' onClick={onClick} cursor="pointer" borderRadius="md" overflow="hidden">
      <Image src={`https://image.tmdb.org/t/p/w500${moviePosterPath}`} alt={movieTitle} borderRadius='md' />

      <CardBody>
        <Stack spacing='2'>
          <Heading as='h2' size='md'>
            {movieTitle}
          </Heading>
          <Text fontSize='sm' color='gray.500'>
            {movieOverview.substring(0, 100) + '...'}
          </Text>
        </Stack>
      </CardBody>

      <CardFooter>
        <Button
          as={Link}
          to={`/movie/${movieId}/${movieSlug}`}
          variant='solid'
          colorScheme='blue'
          w='100%'
          borderRadius='none'
        >
          Watch Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
