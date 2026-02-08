--liquibase formatted sql
--changeset codex:0002-employee-service-charge-columns
ALTER TABLE employee
    ADD COLUMN service_charge_eligibility BIT(1) DEFAULT b'0' AFTER status,
    ADD COLUMN eligible_without_attendance BIT(1) DEFAULT b'0' AFTER service_charge_eligibility,
    ADD COLUMN service_charge_percentage DOUBLE DEFAULT 0 AFTER eligible_without_attendance;
