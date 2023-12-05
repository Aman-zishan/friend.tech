import LeftMenu from '@/components/leftMenu';
import useConnect from '@/lib/hooks/useConnect';
import { truncateAddress } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const { supabase, stxAddress, checkIsKeyHolder } = useConnect();
  const navigate = useNavigate();
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
  return (
    <body className="relative bg-blue-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">Your group chats</h1>

              <hr className="my-10" />

              <div className=" gap-x-20">
                <div>
                  {chatRooms.map((chatRoom: any) => {
                    return (
                      <>
                        {chatRoom.hasAccess && (
                          <div
                            onClick={() =>
                              navigate(
                                `/chatRoom?name=${truncateAddress(
                                  stxAddress!
                                )}&room=${chatRoom.roomId}`
                              )
                            }
                            className="flex items-center justify-between border-b pb-5 mb-10"
                          >
                            <div className="text-lg font-bold">
                              {stxAddress === chatRoom.roomId
                                ? 'My chat room'
                                : `${truncateAddress(
                                    chatRoom.roomId
                                  )}'s chat room`}
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

                  {/* <div className="space-y-4">
                    <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-xs">Number 10</div>
                        <div className="text-gray-400 text-xs">4h</div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        className="font-bold hover:text-yellow-800 hover:underline"
                      >
                        Blog and social posts
                      </a>
                      <div className="text-sm text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          className="text-gray-800 inline align-middle mr-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                        Deadline is today
                      </div>
                    </div>
                    <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-xs">Grace Aroma</div>
                        <div className="text-gray-400 text-xs">7d</div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        className="font-bold hover:text-yellow-800 hover:underline"
                      >
                        New campaign review
                      </a>
                      <div className="text-sm text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          className="text-gray-800 inline align-middle mr-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                        New feedback
                      </div>
                    </div>
                    <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                      <div className="flex justify-between">
                        <div className="text-gray-400 text-xs">Petz App</div>
                        <div className="text-gray-400 text-xs">2h</div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        className="font-bold hover:text-yellow-800 hover:underline"
                      >
                        Cross-platform and browser QA
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default Chats;
