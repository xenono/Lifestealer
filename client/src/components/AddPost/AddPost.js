import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addPost as addPostAction } from "actions/action";

import { generateBase64FromImage } from "utils";

import Input from "components/Inputs/Input/Input";
import Label from "components/Label/Label";
import Button from "components/Button/Button";
import UserInput from "../Inputs/UserInput/UserInput";
import ColorInput from "../Inputs/ColorInput/ColorInput";
import FileInput from "../Inputs/FileInput/FileInput";
import FormWrapper from "../FormWrapper/FormWrapper";


const FlexWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  text-align: center;
`;

const AddPost = ({ addPost }) => {
  const onSubmit = (e) => {
    // e.preventDefault()
    const title = e.target.title.value;
    const content = e.target.content.value;
    const color = e.target.color.value;
    const image = e.target.file.files[0];
    addPost(title, content, color, image);
  };

  const Form = styled.form`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  `;


  return (
    <FormWrapper>
      <Form onSubmit={onSubmit} enctype="multipart/form-data">
        <UserInput label="Title" placeholder="Title of your post." id="title" />
        <UserInput label="What do you want to share?" placeholder="Content of your post." id="content"
                   type="textarea" />
        <FlexWrapper>
          <ColorInput label="Background color" placeholder="Color in hexadecimal" id="color" />
          <FileInput label="Image" text="Choose image" id="file" />
        </FlexWrapper>
        <ButtonWrapper>
          <Button type="submit">
            Publish
          </Button>
        </ButtonWrapper>
      </Form>
    </FormWrapper>
  );
};

AddPost.propTypes = {};

const mapDispatchToProps = () => dispatch => ({
  addPost: (title, content, color, file) => dispatch(addPostAction(title, content, color, file))
});

export default connect(null, mapDispatchToProps)(AddPost);