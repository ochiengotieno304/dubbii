// import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { Card, CardBody, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';



interface MovieCardProps {
  movieTitle: any;
  moviePosterPath: any;
  movieOverview: any;
  movieId: any;
  onClick: any;
}

const MovieCard = ({ movieTitle, movieOverview, moviePosterPath, onClick, movieId }: MovieCardProps) => {
  return (
    <Card maxW='sm' onClick={onClick} w={"240"} align={"center"}>
      <CardBody>
        <Image
          src={`https://image.tmdb.org/t/p/w500${moviePosterPath}`}
          alt='Green double couch with wooden legs'
          borderRadius='lg'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{movieTitle}</Heading>
          <Text>
            {movieOverview.substring(0, 100) + '...'}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing='2'>
          <Link to={`/movie/${movieId}`}>
            <Button variant='solid' colorScheme='blue'>
              Watch Now
            </Button>
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default MovieCard;
