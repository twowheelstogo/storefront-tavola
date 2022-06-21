export default `
query app($language: String! = "en", $inp:AppSearchIn) {
  app(inp: $inp){
    shops {
      _id
      currency {
        code
      }
      defaultNavigationTree(language: $language) {
        ...NavigationTreeFragment
      }
      description
      name
    }
  }
}
fragment NavigationTreeFragment on NavigationTree {
  _id
  shopId
  name
  items {
    navigationItem {
      data {
        ...NavigationItemFields
      }
    }
    items {
      navigationItem {
        data {
          ...NavigationItemFields
        }
      }
      items {
        navigationItem {
          data {
            ...NavigationItemFields
          }
        }
      }
    }
  }
}
fragment NavigationItemFields on NavigationItemData {
  contentForLanguage
  classNames
  url
  isUrlRelative
  shouldOpenInNewWindow
}
`;
