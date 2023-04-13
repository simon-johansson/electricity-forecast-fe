import { FC, Fragment, PropsWithChildren, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Sticky, StickyContainer } from "react-sticky";

const ForecastTable: FC<{}> = () => {
  return (
    <div>
      <ul className="space-y-3">
        <DayTable day="Idag 24 Februari" />
        <DayTable day="Imorgon 25 Februari" />
        <DayTable day="26 Februari" />
        <DayTable day="27 Februari" />
        <DayTable day="28 Februari" />
      </ul>
    </div>
  );
};

export default ForecastTable;

const DayTable: FC<{ day: string }> = (props) => {
  const [viewHourly, setViewHourly] = useState<boolean>(false);
  return (
    <li className="overflow-hidden rounded-md bg-white px-4 py-1 shadow">
      <StickyContainer>
        <ul>
          <li className="relative py-3">
            <Sticky topOffset={10}>
              {({
                style,

                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight,
              }) => (
                <span style={style} className="bg-white font-bold">
                  {props.day}
                </span>
              )}
            </Sticky>
          </li>

          {/* description header */}
          <li className="flex grid grid-cols-3 items-center">
            <span className="text-xs font-light">
              <ClockIcon className="ml-4 h-4 w-4" />
            </span>
            <span className="text-xs font-light">öre/kWh</span>
          </li>

          {viewHourly ? (
            <>
              <TimeRow
                time="00"
                price={54}
                textColor="text-green-500"
                additionalInfo={<BadgeCheap />}
              />
              <TimeRow time="01" price={56} />
              <TimeRow time="02" price={70} />
              <TimeRow time="03" price={23} />
              <TimeRow time="04" price={65} />
              <TimeRow time="05" price={60} />
              <TimeRow time="06" price={67} />
              <TimeRow time="07" price={60} />
              <TimeRow time="08" price={60} />
              <TimeRow time="09" price={60} />
              <TimeRow time="10" price={60} />
              <TimeRow time="11" price={60} />
              <TimeRow time="12" price={60} />
              <TimeRow time="13" price={60} />
              <TimeRow time="14" price={60} />
              <TimeRow time="15" price={60} />
              <TimeRow time="16" price={60} />
              <TimeRow time="17" price={60} />
              <TimeRow time="18" price={60} />
              <TimeRow
                time="19"
                price={60}
                textColor="text-red-500"
                additionalInfo={<BadgeExpensive />}
              />
              <TimeRow time="20" price={60} />
              <TimeRow time="21" price={60} />
              <TimeRow time="22" price={60} />
              <TimeRow time="23" price={60} />
            </>
          ) : (
            <>
              <TimeRow
                time="00-06"
                price={54}
                textColor="text-green-500"
                // additionalInfo={<BadgeCheap />}
              />
              <TimeRow time="06-12" price={56} />
              <TimeRow
                time="12-18"
                price={70}
                textColor="text-red-500"
                // additionalInfo={<BadgeExpensive />}
              />
              <TimeRow time="18-00" price={60} />
            </>
          )}
          <ShowHourForHourRow expanded={viewHourly} onClick={() => setViewHourly(!viewHourly)} />
        </ul>
      </StickyContainer>
    </li>
  );
};

const TimeRow: FC<{
  time: string;
  price: number;
  hideBottomBorder?: boolean;
  textColor?: string;
  additionalInfo?: JSX.Element;
}> = (props) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);

  return (
    <li
      onClick={() => setViewDetails(true)}
      className={`flex grid grid-cols-3 items-center py-3 ${
        props.hideBottomBorder ? "" : "border-b border-gray-200"
      }`}
    >
      <span className="w-12 text-center text-sm">{props.time}</span>
      <span
        className={`text-xl font-semibold ${props.textColor ? props.textColor : "text-gray-900"}`}
      >
        {props.price}
        <span className="text-tiny font-light text-gray-500"> 40-60</span>
        {/*<span className="text-tiny font-light text-gray-500"> snitt</span>*/}
      </span>
      <div className="flex items-center justify-end">
        {props.additionalInfo}
        <div>
          <ChevronRightIcon className="ml-3 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <DetailedViewModal open={viewDetails} setOpen={setViewDetails}>
        <div>
          <Dialog.Title as="h3" className="font-bold leading-6">
            {props.time}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to deactivate your account? All of your data will be permanently
              removed from our servers forever. This action cannot be undone.
            </p>
          </div>
        </div>
      </DetailedViewModal>
    </li>
  );
};

const ShowHourForHourRow: FC<{ expanded: boolean; onClick: () => void }> = (props) => {
  return (
    <li onClick={props.onClick}>
      <div className="flex w-full items-center justify-center py-3 text-gray-500">
        {props.expanded ? (
          <>
            <span className="text-xs">Visa summering</span>
            <ChevronUpIcon className="ml-2 h-3 w-3" />
          </>
        ) : (
          <>
            <span className="text-xs">Visa varje timme</span>
            <ChevronDownIcon className="ml-2 h-3 w-3" />
          </>
        )}
      </div>
    </li>
  );
};

const DetailedViewModal: FC<
  PropsWithChildren & { open: boolean; setOpen: (value: boolean) => void }
> = ({ open, setOpen, children }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-start">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const BadgeCheap: FC<{}> = () => {
  return (
    <span className="flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      <CurrencyDollarIcon className="-ml-2 mr-0.5 h-5 w-5 text-green-500" />
      Billigast
    </span>
  );
};

const BadgeExpensive: FC<{}> = () => {
  return (
    <span className="flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      <CurrencyDollarIcon className="-ml-2 mr-0.5 h-5 w-5 text-red-500" />
      Dyrast
    </span>
  );
};
