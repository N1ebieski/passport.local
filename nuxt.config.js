import fs from 'fs'
import opn from 'opn'

export default {
    /*
    ** Nuxt rendering mode
    ** See https://nuxtjs.org/api/configuration-mode
    */
    mode: 'spa',
    /*
    ** Nuxt target
    ** See https://nuxtjs.org/api/configuration-target
    */
    target: 'server',
    /*
    ** Headers of the page
    ** See https://nuxtjs.org/api/configuration-head
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Global CSS
    */
    css: [
    ],
    /*
    ** Plugins to load before mounting the App
    ** https://nuxtjs.org/guide/plugins
    */
    plugins: [
        '~plugins/vform'
    ],
    /*
    ** Auto import components
    ** See https://nuxtjs.org/api/configuration-components
    */
    components: true,
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module'
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://bootstrap-vue.js.org
        'bootstrap-vue/nuxt',
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseUrl: process.env.API_URL
    },
    /*
    ** Build configuration
    ** See https://nuxtjs.org/api/configuration-build/
    */
    build: {
    },
    generate: {
        dir: 'public'
    },
    server: {
        host: 'passport.local',
        https: {
            key: fs.readFileSync('C:/laragon/etc/ssl/laragon.key'),
            cert: fs.readFileSync('C:/laragon/etc/ssl/laragon.crt')
        }
    },
    srcDir: 'app/',
    hooks: {
        listen (server, { host, port }) {
            opn(`${process.env.APP_URL}:${port}`)
        }
    },
    router: {
        extendRoutes(routes, resolve) {
            routes.splice(
                routes.findIndex(item => item.name === 'auth-login'),
                1,
                {
                    name: 'login',
                    path: '/login',
                    component: resolve(__dirname, 'app/pages/auth/login.vue')
                }
            )
        }
    },
    auth: {
        strategies: {
            local: {
                scheme: 'refresh',
                token: {
                    property: 'access_token',
                    maxAge: 60 * 60 * 24 * 30
                },
                refreshToken: {
                    property: 'refresh_token',
                    data: 'refresh_token',
                    maxAge: 60 * 60 * 24 * 30 * 12
                },
                user: {
                    property: false
                },
                endpoints: {
                    login: {
                        url: process.env.AUTH_URL + '/login',
                        method: 'post'
                    },
                    refresh: {
                        url: process.env.AUTH_URL + '/refresh',
                        method: 'post'
                    },
                    logout: {
                        url: process.env.AUTH_URL + '/logout',
                        method: 'post'
                    },
                    user: {
                        url: process.env.AUTH_URL + '/user',
                        method: 'get'
                    }
                }
            }
        },
        redirect: {
            login: '/login',
            logout: '/login',
            callback: '/login',
            home: '/'
        }
    },
    env: {
        appUrl: process.env.APP_URL,
        apiUrl: process.env.API_URL,
        appName: process.env.APP_NAME
    }
}
