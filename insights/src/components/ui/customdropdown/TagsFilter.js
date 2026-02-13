import React, { useState, useEffect, useRef } from "react";
import "./TagsFilter.css";
import CloseIcon from "@mui/icons-material/Close";
import classes from "../../../components/planning/css/tasklist.module.css";
import { getTags } from "../../../services/jobs/JobsService";
import { useDispatch } from "react-redux";
import { UI_TEXTS } from "../../common/Constants/label-contants";
import { getReportTags } from "../../../services/configurations/configService";

const TagsFilter = (props) => {
  const dispatch = useDispatch();
  const {
    setFilters,
    setTagsSelected,
    tagsSelected,
    tagsViewTagsSelected,
    setTagsViewTagsSelected,
    tagsView,
    type,
  } = props;
  const [tagsSuggestions, setTagsSuggestions] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [hoverIndex, setHoverIndex] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        divRef.current &&
        !divRef.current.contains(event.target) &&
        !event.target.classList.contains(classes.planner_dropbtn)
      ) {
        setFilters({
          FrequencyFilter: false,
          categoryFilter: false,
          hostFilter: false,
          categoryTypeFilter: false,
          TargetFilter: false,
          TagsFilter: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //     const fetchTags = async () => {
  //         const TagsData = await dispatch(getTags(searchTag));
  //         setTagsSuggestions(TagsData?.data?.tags);
  //     };
  //     fetchTags();
  // }, [searchTag]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const TagsData = await dispatch(
          type === "reportTags" ? getReportTags("") : getTags("")
        );

        const tagNames = TagsData?.data?.data
          ?.filter((tag) => tag.tagName)
          .map((tag) => tag.tagName);

        setAllTags(tagNames || []);
        setTagsSuggestions(tagNames || []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setAllTags([]);
        setTagsSuggestions([]);
      }
    };

    fetchAllTags();
  }, []);

  useEffect(() => {
    if (!searchTag.trim()) {
      setTagsSuggestions(allTags);
    } else {
      setTagsSuggestions(
        allTags.filter((tag) =>
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      );
    }
  }, [searchTag, allTags]);

  useEffect(() => {
    if (tagsSelected && tagsSelected.length > 0 && !tagsView) {
      setSelectedTags(tagsSelected);
    } else if (
      tagsViewTagsSelected &&
      tagsViewTagsSelected.length > 0 &&
      tagsView
    ) {
      setSelectedTags(tagsViewTagsSelected);
    }
  }, [tagsSelected, tagsViewTagsSelected]);

  const handleAddTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
  };
  const handleApplyTagsFilter = () => {
    if (tagsView) {
      setTagsViewTagsSelected(selectedTags);
    } else {
      setTagsSelected(selectedTags);
    }
    setFilters({
      categoryFilter: false,
      hostFilter: false,
      categoryTypeFilter: false,
      TargetFilter: false,
      TagsFilter: false,
      FrequencyFilter: false,
    });
  };

  const ClearAll = () => {
    setSelectedTags([]);
  };

  return (
    <div
      className="jobs_tags_filter_container"
      style={{ marginLeft: tagsView ? "39px" : "370px" }}
      ref={divRef}
    >
      <div className="jobs_tags_search_section">
        <div>
          <input
            type="search"
            className="jobs_tags_search_field"
            placeholder="Tags"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </div>
      </div>
      <div className="jobs_tags_selected_filter">
        {selectedTags.length > 0 &&
          selectedTags.map((eachTag, index) => (
            <div
              key={index}
              className="jobs_tags"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {eachTag}
              {hoverIndex === index && (
                <CloseIcon
                  sx={{ fontSize: "15px", marginLeft: "5px" }}
                  onClick={() => handleRemoveTag(eachTag)}
                />
              )}
            </div>
          ))}
      </div>
      <hr />
      <div className="jobs_filter_tags_suggestions">
        {tagsSuggestions?.map((eachTag, index) => (
          <div
            key={index}
            className="jobs_tags"
            onClick={() => handleAddTag(eachTag)}
          >
            {eachTag}
          </div>
        ))}
      </div>

      <div className="jobs_target_apply_btn_container">
        <div className="jobs_selected_tags_count">
          {selectedTags.length} Selected
        </div>

        <div style={{ display: "flex" }}>
          {selectedTags.length > 0 && (
            <div className="jobs_tags_remove_txt" onClick={ClearAll}>
              {UI_TEXTS.LABELS.CLEAR_ALL}
            </div>
          )}
          <button
            className="jobs_target_filter_add_btn"
            onClick={handleApplyTagsFilter}
          >
            {UI_TEXTS.LABELS.APPLY}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsFilter;
