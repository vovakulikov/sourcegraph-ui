
// Reference Color tokens map, in some cases we can't read colors from
// CSS variables scope and have to work with JS variables, this map is
// exactly for this case, do not use it freely, try to read CSS tokens
// defined in the :root scope first.

export default {
	red: {
	    50: "oklch(0.988281 0.0046875 20)",
			100: "oklch(0.966797 0.0171875 20)",
			200: "oklch(0.921875 0.0421875 20)",
			300: "oklch(0.861328 0.078125 20)",
			400: "oklch(0.800781 0.114063 20)",
			500: "oklch(0.742188 0.151562 20)",
			600: "oklch(0.626953 0.135937 20)",
			700: "oklch(0.535156 0.115625 20)",
			800: "oklch(0.419922 0.090625 20)",
			900: "oklch(0.306641 0.065625 20)",
			950: "oklch(0.193359 0.040625 20)",
	},
  orange: {
	    50: 'oklch(0.988281 0.0046875 43.3)',
			100: "oklch(0.966797 0.0171875 43.3)",
			200: "oklch(0.921875 0.0421875 43.3)",
			300: "oklch(0.859375 0.078125 43.3)",
			400: "oklch(0.798828 0.114063 43.3)",
			500: "oklch(0.738281 0.151562 43.3)",
			600: "oklch(0.623047 0.135937 43.3)",
			700: "oklch(0.53125 0.115625 43.3)",
			800: "oklch(0.417969 0.090625 43.3)",
			900: "oklch(0.304688 0.065625 43.3)",
			950: "oklch(0.191406 0.040625 43.3)",
	},
  blue: {
	    50: "oklch(0.988281 0.0046875 240)",
			100: "oklch(0.964844 0.0171875 240)",
			200: "oklch(0.916016 0.0421875 240)",
			300: "oklch(0.849609 0.078125 240)",
			400: "oklch(0.783203 0.114063 240)",
			500: "oklch(0.71875 0.151562 240)",
			600: "oklch(0.605469 0.135937 240)",
			700: "oklch(0.517578 0.115625 240)",
			800: "oklch(0.40625 0.090625 240)",
			900: "oklch(0.296875 0.065625 240)",
			950: "oklch(0.1875 0.040625 240)"
	},
  gray: {
	    50: "oklch(0.988281 0.0046875 275)",
			100: "oklch(0.964844 0.016 275)",
			200: "oklch(0.917969 0.016 275)",
			300: "oklch(0.853516 0.016 275)",
			400: "oklch(0.789063 0.016 275)",
			500: "oklch(0.726563 0.016 275)",
			600: "oklch(0.613281 0.016 275)",
			700: "oklch(0.523438 0.016 275)",
			800: "oklch(0.412109 0.016 275)",
			900: "oklch(0.302734 0.016 275)",
			950: "oklch(0.193359 0.016 275)"
	},
}
