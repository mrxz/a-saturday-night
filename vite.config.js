export default {
    resolve: {
        alias: {
            'aframe': './src/lib/aframe-master.js'
        },
    },
    assetsInclude: ['**/*.fnt'],
    optimizeDeps: {
        include: ['aframe']
    }
}