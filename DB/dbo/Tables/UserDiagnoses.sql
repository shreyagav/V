CREATE TABLE [dbo].[UserDiagnoses] (
    [DiagnosisId] INT            NOT NULL,
    [UserId]      NVARCHAR (450) NOT NULL,
    [Note]        NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_UserDiagnoses] PRIMARY KEY CLUSTERED ([DiagnosisId] ASC, [UserId] ASC),
    CONSTRAINT [FK_UserDiagnoses_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserDiagnoses_Diagnoses_DiagnosisId] FOREIGN KEY ([DiagnosisId]) REFERENCES [dbo].[Diagnoses] ([Id]) ON DELETE CASCADE
);

