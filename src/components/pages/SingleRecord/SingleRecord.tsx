import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Papa from "papaparse";

import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Link,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Layout } from "../../common/Layout/Layout.tsx";

import { IRecord } from "../../../types/records.ts";

const StyledCard = styled(Card)({
  backgroundColor: "#f9f9f9",
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
});

const SectionTitle = styled(Typography)({
  backgroundColor: "#3f51b5",
  color: "#fff",
  padding: "5px 10px",
  marginBottom: "10px",
  textAlign: "center",
});

const DataField = styled(Typography)({
  marginBottom: "10px",
});

const StyledLink = styled(Link)({
  color: "#3f51b5",
  textDecoration: "none",
});

export const SingleRecord = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const [record, setRecord] = useState<IRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const response = await fetch("/fmsca-records.csv");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result: { data: IRecord[] }) => {
        const record_ = result.data.find((item) => item.id === id);
        if (record_) setRecord(record_);
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    getData().then();
  }, []);

  return (
    <Layout>
      <Box sx={{ margin: "0 auto", maxWidth: "812px" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/`)}
          style={{ marginBottom: "16px", color: "#3f51b5" }}
        >
          Back
        </Button>
        {loading && !record ? (
          <Box
            justifyContent="center"
            sx={{ display: "flex", padding: "40px" }}
          >
            <CircularProgress />
          </Box>
        ) : record ? (
          <StyledCard>
            <CardContent sx={{ padding: "0" }}>
              <SectionTitle variant="h6">USDOT INFORMATION</SectionTitle>
              <Box sx={{ padding: "0 24px" }}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>Entity Type:</strong> {record.entity_type}
                    </DataField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>USDOT Status:</strong>{" "}
                      {record.record_status ? record.record_status : "N/A"}
                    </DataField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>USDOT Number:</strong> {record.usdot_number}
                    </DataField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>Out of Service Date:</strong>{" "}
                      {record.out_of_service_date || "None"}
                    </DataField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>MCS-150 Form Date:</strong>{" "}
                      {record.mcs_150_form_date}
                    </DataField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DataField>
                      <strong>MCS-150 Mileage (Year):</strong>{" "}
                      {record.mcs_150_mileage_year}
                    </DataField>
                  </Grid>
                </Grid>
              </Box>
              <SectionTitle variant="h6" style={{ marginTop: "16px" }}>
                OPERATING AUTHORITY INFORMATION
              </SectionTitle>
              <Box sx={{ padding: "0 24px" }}>
                <Box sx={{ display: "flex", gap: "5px" }}>
                  <DataField>
                    <strong>Operating Authority Status:</strong>{" "}
                    {record.operating_status ? record.operating_status : "N/A"},
                  </DataField>
                  <DataField>For Licensing and Insurance details</DataField>
                  <StyledLink href="#">click here</StyledLink>
                </Box>
                <DataField>
                  <strong>MC/MX/FF Number(s):</strong>{" "}
                  {record.mc_mx_ff_number ? record.mc_mx_ff_number : "N/A"}
                </DataField>
              </Box>
              <SectionTitle variant="h6" style={{ marginTop: "16px" }}>
                COMPANY INFORMATION
              </SectionTitle>
              <Box sx={{ padding: "0 24px" }}>
                <DataField>
                  <strong>Legal Name:</strong> {record.legal_name}
                </DataField>
                <DataField>
                  <strong>DBA Name:</strong>{" "}
                  {record.dba_name ? record.dba_name : "N/A"}
                </DataField>
                <DataField>
                  <strong>Physical Address:</strong> {record.physical_address}
                </DataField>
                <DataField>
                  <strong>Phone:</strong> {record.phone}
                </DataField>
                <DataField>
                  <strong>Mailing Address:</strong> {record.mailing_address}
                </DataField>
                <DataField>
                  <strong>DUNS Number:</strong>{" "}
                  {record.duns_number ? record.duns_number : "N/A"}
                </DataField>
                <DataField>
                  <strong>Power Units:</strong> {record.power_units}
                </DataField>
                <DataField>
                  <strong>Drivers:</strong> {record.drivers}
                </DataField>
                <StyledLink href="#" style={{ marginTop: "16px" }}>
                  <strong>Operation Classification;</strong>
                </StyledLink>
              </Box>
            </CardContent>
          </StyledCard>
        ) : null}
      </Box>
    </Layout>
  );
};
