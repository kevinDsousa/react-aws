import { useEffect, useState } from "react";

import { View } from "../../components/View";
import { CatsList } from "../../components/CatsList";
import { PetEditPanel } from "../../components/PetEditPanel";
import { usePetEditForm } from "../../hooks/usePetEditForm";
import { useFetchApi } from "../../hooks/useFetchApi";

export const HomeViewContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [cats, setCats] = useState([]);
  const [ages, setAges] = useState([]);
  const [breeds, setBreeds] = useState([]);

  const { data: catsData, startFetch: starFetchCats } = useFetchApi("/cats");
  const { data: agesData, startFetch: startFetchAges } = useFetchApi("/ages");
  const { data: breedsData, startFetch: startFetchBreeds } = useFetchApi("/breeds");

  const { startFetch: createCat } = useFetchApi("/cats", "POST");

  const form = usePetEditForm({
    onSubmit: (values) => {
      createCat(
        JSON.stringify({
          name: values.name,
          breeds: values.breed.name,
          age: values.age.name,
        }));
    },
  });

  const onOpen = () => {
    setIsOpen(true);
    form.resetForm();
  };

  const onClose = () => {
    setIsOpen(false);
    form.resetForm();
  };

  useEffect(() => {
    starFetchCats();
    startFetchAges();
    startFetchBreeds();
  }, []);

  useEffect(() => {
    if (catsData?.data) {
      setCats(catsData?.data)
    }
  }, [catsData])

  useEffect(() => {
    if (agesData?.data) {
      setAges(agesData?.data)
    }
  }, [agesData])

  useEffect(() => {
    if (breedsData?.data) {
      setBreeds(breedsData?.data)
    }
  }, [breedsData])

  return (
    <>
      <View onOpenEditPetModal={onOpen}>
        <CatsList cats={cats} />
      </View>
      <PetEditPanel
        isOpen={isOpen}
        onClose={onClose}
        formProps={{ ...form, breeds, ages }}
      />
    </>
  );
};
