CREATE TABLE [dbo].[Regions] (
    [RegionId]   INT           IDENTITY (1, 1) NOT NULL,
    [RegionName] NVARCHAR (50) NOT NULL,
    [ShortName]  NVARCHAR (10) NULL,
    [Deleted]    BIT           CONSTRAINT [DF_Regions_Deleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Regions] PRIMARY KEY CLUSTERED ([RegionId] ASC)
);

