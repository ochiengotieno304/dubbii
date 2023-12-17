import { Layout, Menu } from 'antd';

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
    url: '/tv',
  },
  {
    key: '3',
    label: 'Top IMDB',
    url: '/imdb',
  },

]

const BaseLayout = (props: any) => {
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
