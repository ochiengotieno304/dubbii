import { Layout, Image, Row, Col } from "antd";
import moment from "moment";
const { Content } = Layout;
const style: React.CSSProperties = { padding: '16px 0 ' };

interface MovieCardProps {
    movieData: any;
}

const MovieCard = ({
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
}: MovieCardProps) => {
    return (
        <Layout>
            <Content>
                <Row>
                    <Col >
                        <div style={style}>
                            <h1>{title}</h1>
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${poster}`}
                                alt="movie backdrop"
                                width={200}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div style={{ ...style, padding: '16px' }} >
                            <p>{overview}</p>

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
                    </Col>

                </Row>

            </Content>
        </Layout>
    )
}

export default MovieCard;