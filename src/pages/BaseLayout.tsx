import { Layout, Menu, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import theme from '../theme';

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: '1',
    label: 'Movies',
    url: '/',
  },
  {
    key: '2',
    label: 'Tv Shows',
    url: '/',
  },
  {
    key: '3',
    label: 'Top IMDB',
    url: '/',
  },
];

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = (props: BaseLayoutProps) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('1');
  const [path, setPath] = useState(window.location.pathname);
  const [_, setSearchTerm] = useState('');

  useEffect(() => {
    const selectedItem = items.find((item) => item.key === current);
    setPath(selectedItem?.url ?? '/');
  }, [current]);

  const onClick = (e: any) => {
    setCurrent(e.key);
    navigate(path);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Perform search logic here if needed
  };

  return (
    <>

      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px', // Adjusted padding for better spacing
          background: `${theme.colors.blue}`, // Gradient background
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)', // Add a subtle box shadow,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', marginRight: '20px', fontWeight: 'bold' }}>
            Dubbii
          </h1>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items}
          />
        </div>
        <Input.Search
          placeholder="Search movies..."
          onSearch={handleSearch}
          style={{ width: 300, marginRight: '20px' }}
          size="large"
        />
      </Header>

      <Layout>

        <Box p={"16px 10% 16px 10%"} alignContent={'center'}>
          <Content style={{ padding: '5vw', background: '#f0f2f5' }}>
            {props.children}
          </Content>
        </Box>

      </Layout>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff' }}>
        dubbii
      </Footer>
    </>

  );
};

export default BaseLayout;
