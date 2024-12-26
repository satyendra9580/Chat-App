import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor} from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES, HOST} from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAppStore } from "@/store";


function NewDm() {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const {setSelectedChatType,setSelectedChatData}=useAppStore();
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        }
      } else {
        setsearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setsearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rouded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
            </div>
            {searchedContacts.length>0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    className="flex gap-3 items-center cursor-pointer"
                    key={contact.id}
                    onClick={() => {
                      selectNewContact(contact);
                    }}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                          src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase w-12 h-12 text-lg  border-[1px] ${getColor(
                              contact.color
                            )} flex items-center justify-center rounded-full`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : ""}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1  md:flex mt-5  flex-col justify-center items-center hidden duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                options={animationDefaultOptions}
                height={100}
                width={100}
              />
              <div className="text-opacity-80 text-white  flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-1000 text-center">
                <h3 className="poppins-medium">
                  Hi
                  <span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
