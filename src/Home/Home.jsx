import React from 'react';
import Banner from '../Components/Hero/Banner';
import Working_with from '../Components/Working with/Working_with';
import { useLoaderData } from 'react-router';
import How_it_works from '../Components/How it works/How_it_works';
import WhyUseUs from '../Components/Why us/WhyUseUs';

const Home = () => {
  const hospitals = useLoaderData();
  return (
    <div>
      <Banner></Banner>
      <Working_with hospitals={hospitals}></Working_with>
      <How_it_works></How_it_works>
      <WhyUseUs></WhyUseUs>
    </div>
  );
};

export default Home;