import { GatsbyBrowser } from "gatsby";
import React from "react";

import { GlobalStyle, BiesseThemeProvider } from '@fabiofognani/ui-library';

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({ element, props }) => {
  return props?.pageResources?.page?.path?.match("dev-404-page") ? (
    element
  ) : (
    <BiesseThemeProvider>
      <GlobalStyle />
      {element}
    </BiesseThemeProvider>
  );
};
