import styled from "styled-components";

const ProductMediaWrapper = styled.div``;

const StyledTitleVertical = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const StyledSubtitle = styled.div`
  font-size: 14px;
  color: #979797;
  padding-left: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledSubtitleVertical = styled.div`
  font-size: 14px;
  color: #979797;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardContainerVertical = styled.div`
  border: ${({ withBorder, boderColor }) => (withBorder ? boderColor : "none")};
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &:hover: {
    background-color: #eeeeee;
    transition: background-color 0.5s;
  }
`;
const Div = styled.div``;

const ProductPaddingHorizontal = styled.div`
  padding-left: 56px;
  padding-bottom: 20px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
  flex: 1 1 auto;
`;


const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  padding-left: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardContainerHorizontal = styled.div`
  border: ${({ withBorder, boderColor }) => (withBorder ? boderColor : "none")};
  display: flex;
  height: 150px;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
    transition: background-color 0.5s;
  }
`;
export {
  CardContent,
  ProductPaddingHorizontal,
  Div,
  CardContainerVertical,
  StyledSubtitleVertical,
  StyledSubtitle,
  StyledTitleVertical,
  ProductMediaWrapper,
  StyledTitle, CardContainerHorizontal
}