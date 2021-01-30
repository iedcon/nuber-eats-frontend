import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

interface OptionChoice {
  optionId: number;
  choiceId: number;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObjectArr = optionsNumber.map((optionId) => {
      const choices = optionChoices.filter(
        (choice) => choice.optionId === optionId
      );
      const optionsObject = {
        name: rest[`${optionId}-optionName`],
        extra: +rest[`${optionId}-optionExtra`],
        choices: choices.map((choice) => ({
          name: rest[`${optionId}-${choice.choiceId}-choiceName`],
          extra: +rest[`${optionId}-${choice.choiceId}-choiceExtra`],
        })),
      };
      return optionsObject;
    });
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionsObjectArr,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionsClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };
  const [optionChoices, setOptionChoices] = useState<OptionChoice[]>([]);
  const onAddChoicesClick = (optionId: number) => {
    setOptionChoices((current) => [
      { optionId, choiceId: Date.now() },
      ...current,
    ]);
  };
  const onDeleteChoicesClick = (idToDelete: string) => {
    const optionId = idToDelete.split("-")[0];
    const choiceId = idToDelete.split("-")[1];
    console.log(optionId, choiceId);
    setOptionChoices((current) =>
      current.filter(
        (choice) =>
          choice.optionId !== +optionId || choice.choiceId !== +choiceId
      )
    );
  };
  const makeOptionChoices = (optionId: number) => {
    const choices = optionChoices.filter(
      (choice) => choice.optionId === optionId
    );
    return choices.map((choice) => (
      <div key={`${choice.optionId}-${choice.choiceId}`} className="mt-5">
        <input
          ref={register}
          name={`${choice.optionId}-${choice.choiceId}-choiceName`}
          className="py-1 px-4 focus:outline-none ml-10 mr-3 focus:border-gray-600 border"
          type="text"
          placeholder="Choice Name"
        />
        <input
          ref={register}
          name={`${choice.optionId}-${choice.choiceId}-choiceExtra`}
          className="py-1 px-4 focus:outline-none mr-3 focus:border-gray-600 border"
          type="number"
          min={0}
          defaultValue={0}
          placeholder="Choice Extra"
        />
        <span
          className="cursor-pointer text-white bg-red-500 py-2 px-4 mt-5 "
          onClick={() =>
            onDeleteChoicesClick(`${choice.optionId}-${choice.choiceId}`)
          }
        >
          Delete
        </span>
      </div>
    ));
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          placeholder="Price"
          min={0}
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: "Description is required." })}
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionsClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 "
          >
            Add Options
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id}>
                <div key={id} className="mt-5">
                  <input
                    ref={register}
                    name={`${id}-optionName`}
                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    ref={register}
                    name={`${id}-optionExtra`}
                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                    type="number"
                    min={0}
                    defaultValue={0}
                    placeholder="Option Extra"
                  />
                  <span
                    className="cursor-pointer text-white mr-3 bg-blue-500 py-3 px-4 mt-5 "
                    onClick={() => onAddChoicesClick(id)}
                  >
                    Choices
                  </span>
                  <span
                    className="cursor-pointer text-white bg-red-500 py-3 px-4 mt-5 "
                    onClick={() => onDeleteClick(id)}
                  >
                    Delete
                  </span>
                </div>
                {makeOptionChoices(id)}
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        ></Button>
      </form>
    </div>
  );
};
