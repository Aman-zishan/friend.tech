import useConnect from '@/lib/hooks/useConnect';
import { truncateAddress } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConnectWallet from './connectWallet';
import { SVGComponent } from './stacksSvg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const ChatLeftMenu = () => {
  const navigate = useNavigate();
  const { supabase, stxAddress, checkIsKeyHolder } = useConnect();

  const [chatRooms, setChatRooms] = React.useState([]);

  async function getAllChatRooms() {
    const { data, error, status } = await supabase.from('subjects').select();
    console.log(data);

    if (status === 200) {
      const chatRoomsWithAccess = await Promise.all(
        data!.map(async (chatRoom) => ({
          ...chatRoom,
          hasAccess: await checkIsKeyHolder(chatRoom.roomId, stxAddress!)
        }))
      );

      console.log(chatRoomsWithAccess);
      setChatRooms(chatRoomsWithAccess as any);
    }
  }

  useEffect(() => {
    getAllChatRooms();
  }, []);

  const { slug } = useParams();
  const getNavLinkClass = ({ isActive }: any) => {
    return isActive
      ? 'flex items-center gap-5 bg-blue-500 rounded-xl font-bold text-md text-white py-3 px-4'
      : 'flex items-center gap-5 bg-white hover:bg-blue-50 rounded-xl font-bold text-md text-gray-900 py-3 px-4';
  };
  return (
    <aside className="fixed inset-y-0 left-0 bg-white shadow-md w-80 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow">
          <nav className="px-4 py-6 border-b">
            <div className="flex justify-center items-center py-4">
              <a href="/chats" className="absolute left-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </a>

              <div className="text-center flex flex-row items-center gap-2">
                <SVGComponent />
                <h1 className="text-xl font-normal leading-none">
                  <span className="text-blue-500">sFriend</span>.tech
                </h1>
              </div>

              <div className="absolute right-4 opacity-0">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
          </nav>

          <div className="p-4">
            <ul className="space-y-5">
              {chatRooms.map((chatRoom: any) => {
                return (
                  <>
                    {chatRoom.hasAccess && (
                      <div
                        onClick={() => {
                          navigate(
                            `/chatRoom?name=${truncateAddress(
                              stxAddress!
                            )}&room=${chatRoom.roomId}`
                          );
                          window.location.reload();
                        }}
                        className="flex items-center justify-between border-b pb-5 mb-10"
                      >
                        <div className="flex items-stretch font-bold">
                          {stxAddress === chatRoom.roomId
                            ? 'My chat room'
                            : `${truncateAddress(chatRoom.roomId)}'s chat room`}
                        </div>
                        <div className="flex items-center gap-x-2">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-9 px-3 rounded-xl border hover:border-gray-400 text-gray-800 hover:text-gray-900 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              className="bi bi-chat-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="p-10 pb-25">
          <ConnectWallet />
        </div>
      </div>
    </aside>
  );
};

export default ChatLeftMenu;
