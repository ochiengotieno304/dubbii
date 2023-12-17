import { Card } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;

interface MovieCardProps {
    movieTitle: any;
    moviePosterPath: any;
    movieOverview: any;
    movieId: any;
    onClick: any;
}

const MovieCard = ({ movieTitle, movieOverview, moviePosterPath, onClick, movieId }: MovieCardProps) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="movie poster" src={`https://image.tmdb.org/t/p/w500${moviePosterPath}`} />}
            actions={[
                <Link to={`/movie/${movieId}`}>
                    <button>Watch</button>
                </Link>
            ]}
            onClick={onClick}

        >
            <Meta title={movieTitle} description={movieOverview.substring(0, 100) + '...'} />
        </Card>
    );
}

export default MovieCard;
