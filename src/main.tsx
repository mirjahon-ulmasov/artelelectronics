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
import 'react-quill/dist/quill.snow.css';
import 'assets/scss/styles.scss'

const theme: ThemeConfig = {
    token: {
        fontSize: 14,
        fontWeightStrong: 500,
        fontFamily: 'StyreneALC',
        colorPrimary: '#006C41',
        colorError: '#C53434',
        colorBorder: '#878787'
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
        Upload: {
            colorBorder: '#006C41',
        },
        Select: {
            optionSelectedBg: '#c9ded2'
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
