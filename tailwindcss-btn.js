const plugin = require('tailwindcss/plugin')
// const _ = require('lodash')

function hexToRgbA(hex, alpha = 1) {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')'
  }
  throw new Error('Bad Hex')
}

module.exports = plugin(
  function({ theme, variants, e, addUtilities, addComponents }) {
    const btns = {
      '.btn-base': {
        '&:focus': {
          outline: 'none',
        },
        '&:focus-visible': {
          boxShadow: theme('boxShadow.outline'),
        },
      },
      '.btn': {
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontSize: theme('text.base'),
        lineHeight: 1,
        transition: '.15s',
        borderRadius: theme('borderRadius.default'),
        color: 'inherit',
        '&[disabled]': {
          cursor: 'not-allowed',
        },
        '&:not(.btn--disabled-opacity):not(.btn--text):not(.btn--icon):not(.btn--outlined)[disabled]': {
          backgroundColor: theme('btn.disabled.backgroundColor'),
          '&:hover': {
            backgroundColor: theme('btn.disabled.backgroundColor'),
          },
          '&:active': {
            backgroundColor: theme('btn.disabled.backgroundColor'),
          },
        },
        '&:not(.btn--disabled-opacity)[disabled]': {
          color: theme('btn.disabled.color'),
          '&:hover': {
            color: theme('btn.disabled.color'),
          },
          '&:active': {
            color: theme('btn.disabled.color'),
          },
        },
        '&.btn--disabled-opacity[disabled]': {
          opacity: 0.5,
        },
      },
      '.btn--block': {
        width: '100%',
      },
      '.btn--start': {
        justifyContent: 'flex-start',
        textAlign: 'left',
      },
      '.btn--center': {
        justifyContent: 'center',
        textAlign: 'center',
      },
      '.btn--end': {
        justifyContent: 'flex-end',
        textAlign: 'right',
      },
      '.btn--shadow': {
        boxShadow: theme('btn.shadow'),
      },
      '.btn--bold': {
        fontWeight: theme('btn.bold'),
      },
      '.btn.btn--outlined': {
        border: '1px solid',
      },
      '.btn.btn--rounded': {
        borderRadius: '9999px',
      },
      '.btn.btn--tile': {
        borderRadius: '0',
      },
    }

    Object.assign(btns['.btn'], btns['.btn-base'])

    const colors = theme('btn.colors')
    Object.keys(colors).forEach(color => {
      btns[`.btn--${color}`] = {
        color: colors[color].color,
        '&:hover': {
          color: colors[color].color,
        },
        '&:active': {
          color: colors[color].color,
        },
      }
      btns[`.btn--${color}:not(.btn--text):not(.btn--icon):not(.btn--outlined)`] = {
        backgroundColor: colors[color].default,
        '&:hover': {
          backgroundColor: colors[color].hover,
        },
        '&:active': {
          backgroundColor: colors[color].active,
        },
      }
      btns[`.btn--text.btn--${color}, .btn--icon.btn--${color}, .btn--icon.btn--${color}, .btn--outlined.btn--${color}`] = {
        color: colors[color].default,
        '&:hover': {
          color: colors[color].hover,
        },
        '&:active': {
          color: colors[color].active,
        },
      }
      btns[`.btn--text.btn--${color}.btn--alpha-bg, .btn--icon.btn--${color}.btn--alpha-bg, .btn--icon.btn--${color}.btn--alpha-bg`] = {
        '&:hover': {
          backgroundColor: hexToRgbA(colors[color].hover, 0.075),
        },
        '&:active': {
          backgroundColor: hexToRgbA(colors[color].hover, 0.15),
        },
      }
      btns[`.btn--outlined.btn--${color}`] = {
        borderColor: colors[color].default,
        '&:hover': {
          borderColor: colors[color].hover,
        },
        '&:active': {
          borderColor: colors[color].active,
        },
      }
    })

    const sizes = theme('btn.sizes')
    Object.keys(sizes).forEach(size => {
      btns[`.btn--${size}`] = {
        fontSize: sizes[size].fontSize,
        height: sizes[size].height,
        padding: sizes[size].padding,
      }
      btns[`.btn--icon.btn--${size}`] = btns[`.btn--fab.btn--${size}`] = {
        width: sizes[size].height,
        padding: '0',
      }
    })

    addComponents(btns, {
      variants: ['responsive'],
    })
  },
  {
    theme: {
      btn: {
        bold: '500',
        colors: ['primary', 'green', 'blue', 'red', 'black'],
        shadow: '0px 1px .5rem rgba(0, 0, 0, 0.05)',
        disabled: {
          backgroundColor: '#E5E5E5',
          color: '#CBCBCB',
        },
        sizes: {
          tiny: {
            height: '2.5rem',
            padding: '0 1rem',
          },
          sm: {
            height: '3.5rem',
            padding: '0 1.5rem',
          },
          md: {
            height: '4.5rem',
            padding: '0 3.5rem',
          },
          lg: {
            height: '6rem',
            padding: '0 5rem',
          },
        },
      },
    },
    variants: {
      btn: ['responsive'],
    },
  }
)
