import { Layout, Menu, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

]


interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = (props: BaseLayoutProps) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('1');
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const selectedItem = items.find(item => item.key === current);
    setPath(selectedItem?.url ?? '/')
    console.log('current', path)
  }, [current, path]);

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    navigate(path)
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
      <Content style={{ padding: '5vw' }}>
        {props.children}

      </Content>
      <Footer style={{ textAlign: 'center' }}>dubbii</Footer>
    </Layout>
  );
};

export default BaseLayout;
