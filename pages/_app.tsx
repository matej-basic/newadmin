import Layout from '../components/Layout'
import Survey from '../components/NewSurvey'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import React from 'react';


const IndexPage = () => {

    return (
        <Layout title="AdminOn Demand">
            <h1 className="text-3xl font-bold text-center">AdminOn Demand</h1>
            <Survey />
        </Layout>
    )
}

export default IndexPage
