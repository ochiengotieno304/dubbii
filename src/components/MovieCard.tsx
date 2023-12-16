import { Card } from 'antd';

const { Meta } = Card;

interface MovieCardProps {
    movieTitle: any;
    moviePosterPath: any;
    movieOverview: any;

}

const MovieCard = ({ movieTitle, movieOverview, moviePosterPath }: MovieCardProps) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="movie poster" src={`https://image.tmdb.org/t/p/w500${moviePosterPath}`} />}
            actions={[
                <>Watch</>,
              ]}

        >
            <Meta title={movieTitle} description={movieOverview.slice(0, 100) + '...'} />
        </Card>
    );
}

export default MovieCard;