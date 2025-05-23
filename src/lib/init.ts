
// Importing custom fonts, note that they will be imported via
// font-face and won't be loaded by browser if you have no elements
// on the page that don't use these fonts.
import '@fontsource-variable/inter'
import '@fontsource-variable/roboto-mono'

// Design token setup
import './styles/tokens/reference-tokens.scss';
import './styles/tokens/calculated-tokens.scss';
import './styles/tokens/system-tokens.scss';

// Sourcegraph default theme support out of the box
import './styles/themes/standard.scss'

// Minimal reset and global.scss should ensure current component system
// appearance without rapid changes across all UI.
import './styles/reset.scss'
import './styles/global.scss'

