import React from 'react'
import DataContext from './src/context/DataContext'
import AxiosContext from './src/context/AxiosContext'
import App from './App'

const RootComponent = () => {
    return (
        <AxiosContext>
            <DataContext>
                <App />
            </DataContext>
        </AxiosContext>
    )
}

export default RootComponent