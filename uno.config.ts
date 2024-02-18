import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        html, body {
          padding: 0;
          margin: 0;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      `,
    },
  ],
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        Inter: {
          name: 'Inter',
          weights: ['400', '700'],
          italic: true,
          provider: 'google',
        },
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
