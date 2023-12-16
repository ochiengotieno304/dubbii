import React from 'react';
import { Flex, Layout, Menu } from 'antd';
import { fetchLatestMovies } from '../Functions.ts';
import MovieCard from '../components/MovieCard.tsx';

const { Header, Content, Footer } = Layout;
const items = new Array(3).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
  }));


const Home = () => {
    const [latestMovies, setLatestMovies] = React.useState([])
    const [page, setPage] = React.useState(1)
    React.useEffect(() => {
        fetchLatestMovies(page).then((movies) => setLatestMovies(movies))
        setPage(1)
    }, [])

    return (
        <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{padding: '5vw'}}>
  
          <Flex gap={'large'} wrap='wrap'>
  
            {latestMovies.map((movie: any) => (
              <MovieCard
                key={movie.id}
                movieTitle={movie.title}
                movieOverview={movie.overview}
                moviePosterPath={movie.poster_path} />
  
  
            ))}
          </Flex>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    )
}

export default Home;