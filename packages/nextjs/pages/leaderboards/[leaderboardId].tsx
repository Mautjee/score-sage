import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { hardhat } from "wagmi/chains";
import { PaginationButton } from "~~/components/blockexplorer/PaginationButton";
import { SearchBar } from "~~/components/blockexplorer/SearchBar";
import { TransactionsTable } from "~~/components/blockexplorer/TransactionsTable";
import { useFetchBlocks } from "~~/hooks/scaffold-eth";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const Blockexplorer: NextPage = () => {
  const router = useRouter();
  const leaderboardId = router.query.leaderboardId as string;

  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, isLoading, error } = useFetchBlocks();

  useEffect(() => {
    if (getTargetNetwork().id === hardhat.id && error) {
      notification.error(
        <>
          <p className="font-bold mt-0 mb-1">Cannot connect to local provider</p>
          <p className="m-0">
            - Did you forget to run <code className="italic bg-base-300 text-base font-bold">yarn chain</code> ?
          </p>
          <p className="mt-1 break-normal">
            - Or you can change <code className="italic bg-base-300 text-base font-bold">targetNetwork</code> in{" "}
            <code className="italic bg-base-300 text-base font-bold">scaffold.config.ts</code>
          </p>
        </>,
      );
    }

    if (getTargetNetwork().id !== hardhat.id) {
      notification.error(
        <>
          <p className="font-bold mt-0 mb-1">
            <code className="italic bg-base-300 text-base font-bold"> targeNetwork </code> is not localhost
          </p>
          <p className="m-0">
            - You are on <code className="italic bg-base-300 text-base font-bold">{getTargetNetwork().name}</code> .This
            block explorer is only for <code className="italic bg-base-300 text-base font-bold">localhost</code>.
          </p>
          <p className="mt-1 break-normal">
            - You can use{" "}
            <a className="text-accent" href={getTargetNetwork().blockExplorers?.default.url}>
              {getTargetNetwork().blockExplorers?.default.name}
            </a>{" "}
            instead
          </p>
        </>,
      );
    }
  }, [error]);

  return (
    <div className="container mx-auto my-10">
      <div className="container align-center">
        <h2 className="font-bold text-center text-3xl">Board: {leaderboardId}</h2>
      </div>
      <SearchBar />
      <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} isLoading={isLoading} />
      <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Blockexplorer;