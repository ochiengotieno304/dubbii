import { Layout, Menu, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

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

  useEffect(() => {
    const selectedItem = items.find((item) => item.key === current);
    setPath(selectedItem?.url ?? '/');
  }, [current]);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(path);
  };

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
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Box p={"16px 10% 16px 10%"} alignContent={'center'}>
        <Content style={{ padding: '5vw' }}>
          {props.children}
        </Content>
      </Box>
      <Footer style={{ textAlign: 'center' }}>dubbii</Footer>
    </Layout>
  );
};

export default BaseLayout;
