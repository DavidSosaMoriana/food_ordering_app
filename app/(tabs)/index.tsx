import { images, offers } from "@/constants";
import cn from "clsx";
import React, { Fragment } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import '../globals.css'
import CartButton from "@/components/CartButton";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View>
              <Pressable
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row"
                )}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
              >
                {({ pressed }) => (
                  <Fragment>
                    {/* Imagen del producto */}
                    <View className="h-full w-1/2">
                      <Image
                        source={item.image}
                        className="size-full"
                        resizeMode="contain"
                      />
                    </View>

                    {/* Contenedor del texto e icono */}
                    <View
                      className={cn(
                        "offer-card__info",
                        isEven ? "pl-6" : "pr-6"
                      )}
                    >
                      <View
                        className={cn(
                          "flex flex-col",
                          isEven ? "items-end" : "items-start"
                        )}
                      >
                        <Text
                          className={cn(
                            "h1-bold text-white leading-tight mb-3",
                            isEven ? "text-right" : "text-left"
                          )}
                        >
                          {item.title}
                        </Text>

                        {/* Contenedor del icono - siempre alineado a la izquierda del texto */}
                        <View
                          className={cn(
                            "w-full",
                            isEven ? "items-end" : "items-start"
                          )}
                        >
                          <View className={cn(isEven ? "mr-0" : "ml-0")}>
                            <Image
                              source={images.arrowRight}
                              className="size-8"
                              resizeMode="contain"
                              tintColor="#ffffff"
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">DELIVER TO</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">Spain</Text>
                <Image
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
