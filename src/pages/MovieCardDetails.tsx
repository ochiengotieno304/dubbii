import { Layout } from "antd";
import {
    Card,
    Image,
    Stack,
    CardBody,
    Text,
    Heading
} from '@chakra-ui/react';

import moment from "moment";

interface MovieCardDetailsProps {
    movieData: any;
}

const MovieCardDetails = ({
    movieData: {
        title,
        overview,
        poster,
        rating,
        release,
        production,
        genres,
        country,
        languages
    }
}: MovieCardDetailsProps) => {
    return (
        <Layout>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow={'hidden'}
                variant={'outline'}>
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={`https://image.tmdb.org/t/p/w500/${poster}`}
                    alt='Movie Poster'
                />

                <Stack>
                    <CardBody>
                        <Heading size='md'>{title}</Heading>

                        <Text py='2'>
                            {overview}
                        </Text>

                        <div>
                            Genre: {
                                genres.map((genre: any) => {
                                    return (
                                        <span>{genre?.name}, </span>
                                    );
                                })

                            }
                            <br />
                            Production: {
                                production.map((company: any) => {
                                    return (
                                        <span>{company?.name}, </span>
                                    );
                                })

                            }
                            <br />
                            Country: {
                                country.map((country: any) => {
                                    return (
                                        <span>{country?.name}, </span>
                                    );
                                })
                            }
                            <br />
                            Language: {
                                languages.map((language: any) => {
                                    return (
                                        <span>{language?.name}, </span>
                                    );
                                })
                            }
                            <p>Release: {moment(release).format('MMMM Do YYYY')}</p>

                            <p>Rating: {rating}</p>

                        </div>
                    </CardBody>
                </Stack>
            </Card>

        </Layout>
    )
}

export default MovieCardDetails;