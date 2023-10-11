import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, ThemeConfig } from 'antd'
import { Toaster } from 'react-hot-toast'
import { setupStore } from 'store/store'
import ErrorBoundary from 'providers/ErrorBoundary'

import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"

dayjs.extend(weekday)
dayjs.extend(localeData)

import App from './App'
import 'animate.css'
import 'assets/scss/styles.scss'

const theme: ThemeConfig = {
    token: {
        fontSize: 14,
        fontWeightStrong: 500,
        fontFamily: 'StyreneALC',
        colorPrimary: '#006C41',
    },
    components: {
        Table: {},
        Typography: {
            titleMarginBottom: 0,
        },
        Button: {
            colorBorder: '#006C41',
            colorText: '#006C41',
            fontWeight: 400,
        },
        Input: {
            colorBorder: '#878787'
        },
        Select: {
            colorBorder: '#878787'
        },
        Upload: {
            colorBorder: '#006C41',
        }
    },
}

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <BrowserRouter>
                    <ConfigProvider theme={theme}>
                        <Toaster />
                        <App />
                    </ConfigProvider>
                </BrowserRouter>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
)
