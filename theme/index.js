import { extendTheme } from '@chakra-ui/react';
import '@fontsource/berkshire-swash';

const NAME = 'Berkshire Swash';
const STYLE = 'cursive';

const theme = extendTheme({
    fonts: {
        heading: `${NAME}, ${STYLE}`,
        body: `${NAME}, ${STYLE}`,
        buttons: `${NAME}, ${STYLE}`,
    },
});

export default theme;
