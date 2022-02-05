CREATE TABLE [dbo].[Diagnoses] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Description] NVARCHAR (MAX) NULL,
    [OldId]       INT            NOT NULL,
    CONSTRAINT [PK_Diagnoses] PRIMARY KEY CLUSTERED ([Id] ASC)
);

