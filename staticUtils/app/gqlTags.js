export default `
query appPaths($inp:AppSearchIn) {
  app(inp: $inp){
    langs
    tagSlugs 
  }
}
`;
