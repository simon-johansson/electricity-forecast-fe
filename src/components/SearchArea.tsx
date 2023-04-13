import React, { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setIsSearchingLocation, setZone } from "../lib/slice";

const SearchArea: FC<{ open: boolean }> = (props) => {
  const zone = useAppSelector((state) => state.forecastSlice.zone);
  const dispatch = useAppDispatch();

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={(value) => dispatch(setIsSearchingLocation(value))}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          Välj område
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => dispatch(setIsSearchingLocation(false))}
                          >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          Klicka på kartan för att välja för vilket område du är intresserad av
                        </p>
                      </div>
                    </div>
                    <div className="relative flex-1 py-6 px-4 sm:px-6">
                      <figure className="mt-5 grid grid-cols-2">
                        <svg className="h-[450px]" fill="none" viewBox="0 0 41.910002 103.12752">
                          <g>
                            <path
                              d="M41.054 21.069a13.514 13.514 0 0 0-1.003-1.42c-.133.275-.452-1.073-.177-.328.048.115.107.225.177.328a.55.55 0 0 0 0-.177c.149-.903.197-1.82.142-2.732-.186-.95-.798-1.065-.603-2.245.16-.949.674-1.33.053-2.208-.62-.879-1.126-.506-1.073-1.704l-.976-4.435c-.79-2.085-1.109-.4-2.847-1.17-1.74-.773-2.546-2.032-3.549-3.55a10.36 10.36 0 0 1-.62-1.348 4.835 4.835 0 0 0-1.943.08c-1.118.666.15 1.517.7 1.774.133.887-.887.887-1.029 1.615-.142.727.887 1.934 0 2.147-.559.124-1.197-.337-1.694-.568-.497-.23-1.055-.426-1.526-.674-.47-.249-.771-.435-1.162-.054-.221.213-.15.302-.505.32-.355.018-.541 0-.817 0-.274 0-.594-.053-.665.204-.07.257.257.417.373.559.353.357.473.882.31 1.357-.186.47-.887.364-.887 1.002 0 .417.444.887 0 1.251-.443.364-1.33.133-1.313-.532-.399-.133-.772-.328-1.162 0-.39.328-.443.772-.71 1.082-.317.315-.56.697-.71 1.118a3.68 3.68 0 0 1-.558 1.277c-.257.32-.603.541-.887.887-.586.807 0 1.863.346 2.573.834 1.579-.63 3.034-1.428 4.169-.195.284-.453.435-.63.727a4.01 4.01 0 0 0-.24.497l3.992 2.493h.887l2.662 2.661h.887l5.322 3.548.887-1.774 6.05 1.774a5.437 5.437 0 0 1-.603-.745c.576-.284 1.135 1.038 1.774.302.284-.346 0-.887.098-1.286.097-.4-.595-2.254-.329-2.466.142.198.239.425.284.665a.699.699 0 0 0 .346 0c0-.346.213-3.14.48-3.034.106.559.354 1.082.806.807.293-.177 0-.337.462-.39.284 0 .443.16.718.142.275-.018.373-.213.586-.266.213-.053.142-.142.257-.116.115.027.142.267.24.32.456.24 1.014.173 1.401-.169.05.128.133.241.24.329a8.436 8.436 0 0 0-.834-2.617Zm-15.675 2.838c-.177.089-.435 0-.55.204-.115.204 0 .116-.07.169a.284.284 0 0 1-.4 0 1.392 1.392 0 0 1-.302-.417.754.754 0 0 0-.354-.355.488.488 0 0 1-.329-.08.7.7 0 0 1-.204-.346c-.133-.372-.399-.754-.754-.771-.115.01-.23.01-.346 0a.248.248 0 0 1-.186-.284c0-.125.186-.125.31-.125.17-.002.338-.044.488-.124a.177.177 0 0 0 .098-.106.186.186 0 0 0-.071-.178.886.886 0 0 0-.39-.106c-.373-.08-.621-.48-.887-.798a.576.576 0 0 0-.284-.222.505.505 0 0 0-.195 0l-1.846.293c-.088 0-.248 0-.292-.116a.435.435 0 0 1 0-.31.56.56 0 0 1 .088-.151.674.674 0 0 1 .417-.142 3.326 3.326 0 0 1 1.695-.169c.727.178 1.33.817 2.049 1.074.497.177 1.1.213 1.428.692a.16.16 0 0 1 0 .08c0 .053-.053.088-.098.106a2.243 2.243 0 0 1-.656.195.453.453 0 0 0-.248.08.381.381 0 0 0-.063.408.79.79 0 0 0 .276.328c.106.082.226.145.354.187.295.027.592.027.887 0a.683.683 0 0 1 .64.576.417.417 0 0 1-.178.408h-.027Zm.63-8.143c-.7.133-1.322-.444-1.907-.887-1.943-1.455-2.662-.816-4.533-2.404a.622.622 0 0 1-.258-.39.426.426 0 0 1 .453-.426h.089c.237.086.446.236.603.434 1.65 1.642 2.297.888 4.196 2.12l.984.613c.188.089.345.23.453.408.088.16.15.496 0 .54l-.08-.008Zm2.395-7.55a10.84 10.84 0 0 0-3.548-2.11 1.26 1.26 0 0 1-.657-.373.55.55 0 0 1 .053-.736c.196-.142.435.062.604.23a7.726 7.726 0 0 0 2.368 1.242 3.007 3.007 0 0 1 1.774 1.943c-.088.177-.363-.018-.567-.195h-.027Z"
                              // fill="#C4EBDB"
                              fill={zone === "1" ? "#4ade80" : "#94a3b8"}
                              onClick={() => {
                                dispatch(setZone("1"));
                              }}
                            />
                            <path
                              d="M35.298 30.56a1.056 1.056 0 0 0-.222-.984l-5.99-1.758-.889 1.775-5.325-3.55h-.887l-2.663-2.663h-.887l-3.896-2.583a7.869 7.869 0 0 0-.33 1.003c-.123.462-.115.959-.559 1.198-.444.24-1.083 0-1.482.373-.151.15-.213.337-.39.462a5.553 5.553 0 0 0-.587.32.94.94 0 0 0-.24 1.206c.262.417.429.887.488 1.376a4.305 4.305 0 0 1-.382 1.625 7.58 7.58 0 0 0-.71 2.148c0 .603-.072 1.216-.125 1.775a5.904 5.904 0 0 1-1.12 2.663c-.5.718-.682 1.61-.506 2.468.213.532.133 1.065.328 1.597.292.826-.098 1.048-.649 1.483a1.687 1.687 0 0 1-1.828.204c-.426-.142-1.065-.302-1.376.204-.232.105-.44.256-.613.444-.195.248-.16.621-.31.887a3.623 3.623 0 0 0-.427.888c-.089.4-.267.781-.355 1.172a3.32 3.32 0 0 0 .053 1.083 12 12 0 0 0 0 1.464 6.15 6.15 0 0 1 .398 1.607c-.011.463-.05.926-.116 1.385-.106.7-.47 1.145-.364 1.89h1.775L6 52.61l.887.888.887 2.662 2.663.888h1.775l1.775.888 1.774 2.663 1.776.887-.002 3.55 1.775 1.776 1.128-1.127a.31.31 0 0 0 0-.222c-.062-.062-.408-.222-.435-.284-.026-.062.302-.675.4-1.039.39-.133.16-.381.124-.541a.541.541 0 0 1-.195-.249 1.678 1.678 0 0 1 0-.47h.195c.107-.613-.186-.577-.612-.63-.053-.524.568-.586.702-.959.133-.373-.124-1.03 0-1.482.201.029.4.073.595.133.098-.684 0-.888-.488-1.154-.16-1.35.498-2.663.17-4.083 0-.045-.408-1.34-.568-.941.195-.47 1.056-.08 1.438-.222 1.047-.4.312-4.536 1.368-5.015a11.71 11.71 0 0 0 2.113-2.601c.302-.524.17-1.012-.39-1.172.249-.887.533-.665 1.128-.523.967.24.15-1.19 1.047-.888.098.461.524.382.888.382a9.77 9.77 0 0 0 0-1.882c.338-.151.533-.453.888-.196.355.258.169.666.728.56a.985.985 0 0 1 .364-.888c0-.053.337-.248.39-.293.054-.044.17-.195.276-.275.106-.08.541-.071.586-.462a.444.444 0 0 0-.541-.488s-.054-.08-.098-.124c-.168-.825.515-.24.692-.186.533.168.382-.098.8-.4.168-.115.487-.053.603-.142.115-.089.089-.23.186-.435.098-.204.347-.648.498-.959.284-.612-.088-1.668.48-2.165.364-.32 1.349-.302 1.411-1.136 0-.444-.355-.285-.532-.675-.177-.39-.08-.657.346-.693-.186-.887-.887.134-1.162-.248-.275-.382-.755-.124-.71-.825.275 0 .816.346 1.012 0 .266-.524-.488-.622-.71-.8v-.16a5.496 5.496 0 0 0 1.873-.292ZM11.327 47.782l-.178.089a.337.337 0 0 0-.177.364c.028.146.085.285.168.408.193.283.27.63.213.968a.32.32 0 0 1-.293.301c-.142 0-.275-.186-.328-.364a.888.888 0 0 0-.24-.479l-.053-.089a.639.639 0 0 1-.169-.532 1.59 1.59 0 0 0 0-.586.931.931 0 0 0-.514-.435.364.364 0 0 1-.204-.213.293.293 0 0 1 .089-.293.515.515 0 0 1 .275-.106c.456-.06.918.062 1.287.337.088.062.204.23.293.302l.053.062a.266.266 0 0 1-.16.266h-.062Z"
                              // fill="#84D7B5"
                              fill={zone === "2" ? "#4ade80" : "#cbd5e1"}
                              onClick={() => {
                                dispatch(setZone("2"));
                              }}
                            />
                            <path
                              d="M26.135 72.018c-.133-.134-.515-.258-.604-.436-.088-.177 0-.56-.15-.888-.152-.328-1.386-.817-.667-1.075a2.487 2.487 0 0 0-.453-1.065c-.177-.213-.497-.222-.684-.4-.186-.178-.168-.195-.302-.515-.133-.32-.24-.888-.746-.64-.337.16-.302.755-.737.613 0-.48-.08-.657-.533-.621.267-.578-.195-.835-.613-.791a1.862 1.862 0 0 0 0-.293c-.213 0-.222-.151-.222-.258l-1.101 1.173-1.776-1.777v-3.552l-1.777-.889-1.776-2.664-1.776-.888H10.44l-2.664-.888-.889-2.665L6 52.611l-.888-.888H3.336a1.717 1.717 0 0 0 0 .204c.148.287.275.583.382.888.105.369.176.746.213 1.128a5.577 5.577 0 0 1-.338 1.261c-.114.475-.203.955-.266 1.44-.03.425.184.83.55 1.047.214.187.462.276.676.444.213.17.222.329.355.604.133.276.462.649.64.977.32.63 0 2.114-.214 2.798a.95.95 0 0 0-.808.204c-.267.24-.267.311-.622.356-1.341.177.071 1.847.107 2.584-.056.333-.094.668-.116 1.004.06.226.14.446.24.657.228.477.346 1 .346 1.528 0 .506-.4.817-.497 1.297-.098.48.133 1.163-.497 1.554-.364.222-.95-.053-1.253.258-.302.31.151.888 0 1.287-.15.4-.737.444-.64 1.155.08.577.516.693.534 1.323.082.538.1 1.084.053 1.626-.06.213-.131.424-.213.63-.062.213 0 .56-.089.826-.195.746-.63 0-.817-.328a1.101 1.101 0 0 0-.497-.48.471.471 0 0 1-.098.204 2.887 2.887 0 0 0-.284 2.585c.072.322.072.655 0 .977a.941.941 0 0 0 .16.808c.168.204.293.187.4.48.24.648 0 1.003-.072 1.634-.07.764.542.72.578.044 0-.302-.125-.355 0-.621.124-.267.373-.16.328-.55-.55-.17-.266-1.315 0-.996.107.116 0 .329.124.436.125.106.231.053.311.142.167.246.25.538.24.835-.462.213-.542.213-.666.781-.071.32-.169.489-.204.71l.888 1.777 2.664.888v.888l1.777.889h1.776l1.777.888v-1.768h4.44v-4.44h1.777l.888-2.665 1.776.888.436.435c0-.462-.587-.95-.96-1.039-.16-.888.96-.515 1.182-.888 0-.071-.294-.746.213-.675.31 0 .169.71.595.622 0-.32-.231-.817.204-.889.053-.55.329-.719.808-.666.072-.346-.168-1.279.507-.888 0 .329-.311 1.181.062 1.306.373.124.444-.498.728-.63.053-.48.258-.552.542-.738.284-.187.524-.338.817-.506a1.528 1.528 0 0 0-.16-.888c-.47-.214-.72-.889-1.296-.542v.16c-.276 0-.693.07-.756-.32a.64.64 0 0 0-.328 0c.053.764-.95.346-.995-.231a3.553 3.553 0 0 0-2.371-.782c.097.729-.684.16-.95.125-.267-.036-.889.204-.525-.56a2.984 2.984 0 0 0 1.492-.293c.293-.107 1.155.213 1.217-.382.48-.053.666-.204 1.075.08.222.16.817.835.888.08.338 0 .888.63 1.164.888.408.47.48.817 1.199.533.72-.284.462-.489.675-1.021.142-.347.39-.373.595-.631.204-.258.16-.497.302-.737s.577-.498.755-.933a1.306 1.306 0 0 1-.125-.781Zm-19.113 9.13c-.8 0 .053-.888-.755-.968-.809-.08-.888 1.776-1.706 1.776-.817 0 .054-.888.054-.888.466-.49.775-1.109.888-1.776.053-.888.15-2.771.95-2.727.8.044.764.915 1.581.915s-.657-2.816.151-2.771c.808.044 1.626-.782 2.38.106.755.889-.248 4.619-1.048 4.583-.799-.035-1.74 1.794-2.495 1.75Zm5.862.622c-.178.337-.391.613-.551.986-.16.373-1.03.71-1.137 1.092-.148.606-.341 1.2-.577 1.777-.111.29-.26.565-.444.817-.391.488 0 .453-.373.177a12.382 12.382 0 0 1 1.119-3.384c.286-.733.64-1.437 1.057-2.105.15-.323.372-.609.648-.834.24-.152.498 0 .542.337.011.398-.087.791-.284 1.137Zm.56-14.54a.524.524 0 0 1-.312-.08 4.325 4.325 0 0 1-1.11-1.012 1.04 1.04 0 0 1-.346-.764.363.363 0 0 1 .053-.16.382.382 0 0 1 .32-.133 2.95 2.95 0 0 1 .888.08c.332.049.618.258.764.56-.107.275.275.594.222.888-.053.293-.231.595-.48.621Zm2.877 4.441a.506.506 0 0 1-.178.515.701.701 0 0 1-.497.125.337.337 0 0 1-.178-.054c-.16-.115-.115-.39-.16-.604a.826.826 0 0 0-.328-.47c-.151-.116-.32-.196-.47-.302a.204.204 0 0 1-.099-.125c0-.115.107-.177.205-.204a3.687 3.687 0 0 1 1.572 0c.169 0 .213.338.204.533-.009.195-.133.444-.071.622v-.036Zm10.48 18.288c.214.31.24.435.036.71-.098.134-.195.205-.284.33-.089.123-.018.283-.089.408-.16.293-.453.541-.595.799-.142.258-.533.489-.595.817-.062.329.195.329.266.613.107.444-.257.648-.568.728-.835.222-.888-.737-.24-1.11.097-.3.047-.629-.133-.888-.071-.107-.16-.053-.267-.195-.106-.143-.053-.152-.106-.338a3.278 3.278 0 0 1-.24-.702c.027-.346.284-.31.169-.746-.071 0-.125-.062-.196-.062a.888.888 0 0 1 .471-.941c.302-.205.4-.578.586-.782.187-.204.373-.648.666-.72.294-.07.649-.008.95-.07.534-.125.516.266.24.763-.275.498-.417.88-.07 1.386Z"
                              // fill="#00BA7D"
                              fill={zone === "3" ? "#4ade80" : "#94a3b8"}
                              onClick={() => {
                                dispatch(setZone("3"));
                              }}
                            />
                            <path
                              d="m17.36 81.877-.888 2.662h-1.775v4.438h-4.438v1.774l-1.774-.887H6.71l-1.775-.887v-.888l-2.663-.887-.887-1.775c-.022.129-.022.261 0 .39.127.376.071.79-.15 1.118-.24.329-.41.418-.32.932.268.136.52.3.754.488.178.082.35.177.515.284.284.358.479.777.568 1.225.186.577.452 1.145.62 1.722.17.576-.088 1.1.382 1.446.24.178.409.187.533.488.124.302.16.568.302.888.23.47.479.887.887.488.257-.213.124-.302.417-.098.18.13.31.318.364.533a4.34 4.34 0 0 1-.595 1.704c-.301.266-1.064-.24-1.304.142-.24.381.461.887.55 1.127.089.24.053.408.284.603.23.195.373.195.541.426-.009.365.009.73.054 1.092.046.397.07.797.07 1.198-.727.55 0 1.136.586 1.145a3.06 3.06 0 0 0 1.376-.471c.44-.238.981-.178 1.358.151.79.488 1.446-.754 1.198-1.544-.16-.515-.453-.888-.23-1.5.221-.612.887-.32 1.375-.328.488-.01.364-.648.497-1.083.479 0 .79.453 1.25.55.462.098.968-.186 1.492-.213.524-.026.754.772 1.216.817.461.044.674-1.03.78-1.43a7.8 7.8 0 0 1 .302-1.534c.222-.426.55-.622.728-1.119.104-.544.17-1.096.195-1.65.098-.48.595-.586.364-1.145-.23-.56-.754-.746-.515-1.411.24-.666.72-.515.79-1.225-.195-.204-.559-.32-.39-.683.168-.364.603-.328.435-.781-.276-.115-.764-.222-.64-.683.125-.462.338-.205.143-.64-.071-.15-.435-.62 0-.7.115 0 .497.284.674.31.295.038.593.038.888 0 0-.364-.48-.648-.675-.887a.444.444 0 0 1-.098-.417.701.701 0 0 1 .072-.196c0-.07.097-.07.15-.115.065-.12.11-.248.133-.382 0-.124.107-.213.151-.337.045-.124 0-.168 0-.275.004-.05.004-.1 0-.15 0-.063-.097-.205-.16-.134-.061.071 0 .249 0 .302-.141-.142-.816-.382-.763-.63.054-.249.835 0 1.03 0l-.435-.47-1.775-.888ZM19.4 95.188c.15-1.011.674-1.899.887-2.91 0-.276.053-.8-.293-.888-.346-.089-.372.382-.452.639a5.53 5.53 0 0 1-.506 1.686 3.187 3.187 0 0 0-.621.888 6.574 6.574 0 0 0-.169 1.473c0 .337-.435 2.804.293 1.952.554-.844.853-1.83.86-2.84Z"
                              // fill="#009B63"
                              fill={zone === "4" ? "#4ade80" : "#cbd5e1"}
                              onClick={() => {
                                dispatch(setZone("4"));
                              }}
                            />
                          </g>
                          <defs>
                            <clipPath id="a">
                              <path fill="#fff" d="M0 0h41.91v103.128H0z" />
                            </clipPath>
                          </defs>
                        </svg>
                        <div className="pl-5">
                          <div className="flex h-[150px] items-center">
                            <div onClick={() => dispatch(setZone("1"))}>
                              <strong className="text-sm">Elområde 1 (SE1)</strong>
                              <div className="text-sm font-medium italic text-gray-500">Luleå</div>
                            </div>
                          </div>
                          <div className="flex h-[140px] items-center">
                            <div onClick={() => dispatch(setZone("2"))}>
                              <strong className="text-sm">Elområde 2 (SE2)</strong>
                              <div className="text-sm font-medium italic text-gray-500">
                                Sundsvall
                              </div>
                            </div>
                          </div>
                          <div className="flex h-[100px] items-center">
                            <div onClick={() => dispatch(setZone("3"))}>
                              <strong className="text-sm">Elområde 3 (SE3)</strong>
                              <div className="text-sm font-medium italic text-gray-500">
                                Stockholm
                              </div>
                            </div>
                          </div>
                          <div className="flex h-[80px] items-center">
                            <div onClick={() => dispatch(setZone("4"))}>
                              <strong className="text-sm">Elområde 4 (SE4)</strong>
                              <div className="text-sm font-medium italic text-gray-500">Malmö</div>
                            </div>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default SearchArea;
