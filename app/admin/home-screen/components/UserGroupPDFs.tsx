"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@mui/material";
import { fetchSessionsbyUserGroup } from "@/actions/supabase/queries/sessions";
import Pdf from "@/assets/images/pdf.svg";
import Search from "@/assets/images/search.svg";
import { ImageLogo } from "@/components/styles";
import { UUID } from "@/types/schema";
import { buildSessionDisplayName } from "@/utils/session-details";
import {
  Container,
  FileDate,
  FileIconWrapper,
  FileInfo,
  FileList,
  FileName,
  FileRow,
  Header,
  SearchIcon,
  SearchInput,
  SearchWrapper,
  StyledTab,
  TabButton,
  TabsWrapper,
  Title,
  WarningText,
} from "./styles";

type ActiveTab = "active" | "completed";

type FileItem = {
  id: string;
  displayName: string;
  created_at: string | null;
  is_finished: boolean;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function UserGroupPDFs({ userGroup }: { userGroup: UUID }) {
  const router = useRouter();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("completed");

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ActiveTab,
  ) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (!userGroup) return;

    (async () => {
      const data = (await fetchSessionsbyUserGroup(userGroup)) ?? [];

      const sessions = data.map(s => ({
        id: s.session_id,
        displayName: buildSessionDisplayName(
          s.template?.template_name,
          s.created_at,
        ),
        created_at: s.created_at,
        is_finished: s.is_finished === true,
      }));

      setFiles(sessions);
    })();
  }, [userGroup]);

  const activeFiles = useMemo(() => files.filter(f => !f.is_finished), [files]);
  const pastFiles = useMemo(() => files.filter(f => f.is_finished), [files]);

  const filteredFiles = useMemo(() => {
    const source = activeTab === "active" ? activeFiles : pastFiles;
    return source.filter(file =>
      file.displayName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [activeFiles, pastFiles, activeTab, search]);

  const handleRowClick = (file: FileItem) => {
    if (activeTab === "active") {
      router.push(`/facilitator/session-view?sessionId=${file.id}`);
    } else {
      router.push(`/sessions/session-finish/${file.id}`);
    }
  };

  const currentCount =
    activeTab === "active" ? activeFiles.length : pastFiles.length;

  return (
    <Container>
      <Header>
        <Title>
          {activeTab === "active" ? "Active Sessions" : "Completed Sessions"} (
          {currentCount})
        </Title>
      </Header>

      <TabsWrapper>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="session status tabs"
        >
          <StyledTab label="Active" value="active" />
          <StyledTab label="Completed" value="completed" />
        </Tabs>
      </TabsWrapper>

      <SearchWrapper>
        <SearchIcon>
          <ImageLogo src={Search.src} alt="Search" width={12} height={12} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search file..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchWrapper>

      <FileList>
        {filteredFiles.length === 0 ? (
          <WarningText style={{ color: "#888", textAlign: "center" }}>
            No {activeTab} sessions found.
          </WarningText>
        ) : (
          filteredFiles.map(file => (
            <FileRow key={file.id} onClick={() => handleRowClick(file)}>
              <FileIconWrapper>
                <ImageLogo src={Pdf.src} alt="Pdf" width={12} height={12} />
              </FileIconWrapper>
              <FileInfo>
                <FileName>{file.displayName}</FileName>
                <FileDate>{formatDate(file.created_at)}</FileDate>
              </FileInfo>
            </FileRow>
          ))
        )}
      </FileList>
    </Container>
  );
}
