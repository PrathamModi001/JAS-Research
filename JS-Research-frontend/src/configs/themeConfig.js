const themeConfig = {
  // ** Layout Configs
  templateName: 'JAS Research Portal' /* App Name */,
  mode:
    typeof window !== 'undefined' && localStorage.getItem('user-theme')
      ? localStorage.getItem('user-theme')
      : 'light' /* light | dark */,
  contentWidth: 'boxed' /* full | boxed */,
  // ** Routing Configs
  routingLoader: true /* true | false */,
  // ** Navigation (Menu) Configs
  menuTextTruncate: true /* true | false */,
  navigationSize: 260 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,
  // ** Other Configs
  responsiveFontSizes: true /* true | false */,
  disableRipple: false /* true | false */
}

export default themeConfig
