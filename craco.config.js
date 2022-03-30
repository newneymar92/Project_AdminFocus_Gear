const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "blue",
              "@layout-body-background": "#1b1b38",
              // "@table-bg": "#323259",
              "@table-header-bg": "#323259",
              "@table-body-sort-bg":"#323259",
              "@table-header-color": "#FFFFFF",
              "@table-header-sort-bg": "#323259",
              "@table-row-hover-bg": "#323259",
              "@table-selected-row-color": "#FFFFFF",
              "@table-selected-row-bg": "#323259",
              // "@table-body-selected-sort-bg": "#323259",
              "@table-selected-row-hover-bg":"#323259",
              // "@input-color":"#FFFF"
              // "@input-bg": "#252547",
              // "@text-color": "#FFFFFF",
              // "@input-border-color": "#252547",
              // "@select-dropdown-bg": "#252547",
              // "@select-background": "#252547",
              // "@select-item-selected-bg": "#252547",
              // "@pagination-item-bg": "#323259",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
