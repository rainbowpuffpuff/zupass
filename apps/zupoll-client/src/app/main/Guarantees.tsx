import { Card } from "@/components/ui/card";
import { FaEyeSlash, FaUnlink, FaVoteYea } from "react-icons/fa";
import styled from "styled-components";

export function GuaranteesElement() {
  return (
    <GuaranteeContainer className="text-sm">
      <Card className="w-1/3">
        <Guarantee>
          <FaEyeSlash size={"14px"} className="shrink-0" /> The server never
          learns your identity.
        </Guarantee>
      </Card>
      <Card className="w-1/3">
        <Guarantee>
          <FaVoteYea size={"14px"} className="shrink-0" /> One vote per
          participant.
        </Guarantee>
      </Card>
      <Card className="w-1/3">
        <Guarantee>
          <FaUnlink size={"12px"} className="shrink-0" /> Unlinkable votes
          across ballots/devices.
        </Guarantee>
      </Card>
    </GuaranteeContainer>
  );
}

const GuaranteeContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: row;
  gap: 16px;
  box-sizing: border-box;

  /**
   * mobile styling
   */
  @media screen and (max-width: 640px) {
    margin-left: 0%;
    width: 100%;
    gap: 6px;
    font-size: 0.8rem;
    flex-direction: column;

    div {
      width: 100%;
    }
  }
`;

const Guarantee = styled.div`
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  padding: 16px;
  gap: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;

  /**
   * mobile styling
   */
  @media screen and (max-width: 640px) {
    flex-direction: row;
    margin-bottom: 0;
    align-items: center;
    max-width: 100% !important;
    width: 100% !important;
  }
`;
