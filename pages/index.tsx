import type { NextPage } from 'next';
import Layout from '../components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-bold">Hello World</h1>
    </Layout>
  );
};

export default Home;
